using JobPortal.API.Data;
using JobPortal.API.DTOs.Applications;
using JobPortal.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.API.Services;

public interface IApplicationService
{
    Task<ApplicationDto?> ApplyAsync(int candidateId, CreateApplicationDto dto);
    Task<IEnumerable<ApplicationDto>> GetCandidateApplicationsAsync(int candidateId);
    Task<IEnumerable<ApplicationDto>?> GetJobApplicationsAsync(int jobId, int recruiterId);
    Task<ApplicationDto?> UpdateApplicationStatusAsync(int applicationId, int recruiterId, UpdateStatusDto dto);
}

public class ApplicationService : IApplicationService
{
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;

    public ApplicationService(AppDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    public async Task<ApplicationDto?> ApplyAsync(int candidateId, CreateApplicationDto dto)
    {
        // 1. Check if job exists and is active
        var job = await _context.Jobs
            .Include(j => j.Recruiter)
            .ThenInclude(r => r.RecruiterProfile)
            .FirstOrDefaultAsync(j => j.Id == dto.JobId && j.IsActive);
        if (job == null) return null;

        // 2. Check for duplicate application
        var alreadyApplied = await _context.Applications
            .AnyAsync(a => a.JobId == dto.JobId && a.CandidateId == candidateId);
        if (alreadyApplied) return null;

        // 3. Create Application
        var application = new Application
        {
            JobId = dto.JobId,
            CandidateId = candidateId,
            CoverLetter = dto.CoverLetter,
            Status = ApplicationStatus.Pending,
            AppliedAt = DateTime.UtcNow
        };

        _context.Applications.Add(application);
        await _context.SaveChangesAsync();

        // Fetch candidate information for email and return DTO
        var candidate = await _context.Users
            .Include(u => u.CandidateProfile)
            .FirstAsync(u => u.Id == candidateId);

        // Send confirmation email asynchronously (fire and forget or await, let's await for reliability in mvp)
        var companyName = job.Recruiter?.RecruiterProfile?.CompanyName ?? job.Recruiter?.Name ?? "Company";
        await _emailService.SendApplicationConfirmationAsync(candidate.Email, job.Title, companyName);

        return ToDto(application, job, candidate);
    }

    public async Task<IEnumerable<ApplicationDto>> GetCandidateApplicationsAsync(int candidateId)
    {
        var applications = await _context.Applications
            .Include(a => a.Job)
            .ThenInclude(j => j.Recruiter)
            .ThenInclude(r => r.RecruiterProfile)
            .Include(a => a.Candidate)
            .ThenInclude(c => c.CandidateProfile)
            .Where(a => a.CandidateId == candidateId)
            .OrderByDescending(a => a.AppliedAt)
            .ToListAsync();

        return applications.Select(a => ToDto(a, a.Job, a.Candidate));
    }

    public async Task<IEnumerable<ApplicationDto>?> GetJobApplicationsAsync(int jobId, int recruiterId)
    {
        // Check if job belongs to recruiter
        var job = await _context.Jobs.FindAsync(jobId);
        if (job == null || job.RecruiterId != recruiterId) return null;

        var applications = await _context.Applications
            .Include(a => a.Job)
            .ThenInclude(j => j.Recruiter)
            .ThenInclude(r => r.RecruiterProfile)
            .Include(a => a.Candidate)
            .ThenInclude(c => c.CandidateProfile)
            .Where(a => a.JobId == jobId)
            .OrderByDescending(a => a.AppliedAt)
            .ToListAsync();

        return applications.Select(a => ToDto(a, a.Job, a.Candidate));
    }

    public async Task<ApplicationDto?> UpdateApplicationStatusAsync(int applicationId, int recruiterId, UpdateStatusDto dto)
    {
        var application = await _context.Applications
            .Include(a => a.Job)
            .Include(a => a.Candidate)
            .FirstOrDefaultAsync(a => a.Id == applicationId);

        if (application == null) return null;

        // Check if recruiter owns the job
        if (application.Job.RecruiterId != recruiterId) return null;

        if (!Enum.TryParse<ApplicationStatus>(dto.Status, true, out var newStatus))
            return null;

        application.Status = newStatus;
        await _context.SaveChangesAsync();

        // Send status update email
        await _emailService.SendStatusUpdateAsync(application.Candidate.Email, application.Job.Title, newStatus.ToString());

        // Refresh with candidate profiles etc
        var candidateWithProfile = await _context.Users
            .Include(u => u.CandidateProfile)
            .FirstAsync(u => u.Id == application.CandidateId);

        var jobWithRecruiter = await _context.Jobs
            .Include(j => j.Recruiter)
            .ThenInclude(r => r.RecruiterProfile)
            .FirstAsync(j => j.Id == application.JobId);

        return ToDto(application, jobWithRecruiter, candidateWithProfile);
    }

    private static ApplicationDto ToDto(Application a, Job j, User c) => new()
    {
        Id = a.Id,
        JobId = a.JobId,
        JobTitle = j.Title,
        CompanyName = j.Recruiter?.RecruiterProfile?.CompanyName ?? j.Recruiter?.Name ?? "Unknown",
        CandidateId = a.CandidateId,
        CandidateName = c.Name,
        CandidateEmail = c.Email,
        Status = a.Status.ToString(),
        AppliedAt = a.AppliedAt,
        CoverLetter = a.CoverLetter,
        CVUrl = c.CandidateProfile?.CVUrl
    };
}
