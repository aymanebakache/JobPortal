using JobPortal.API.Data;
using JobPortal.API.DTOs.Jobs;
using JobPortal.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.API.Services;

public interface IJobService
{
    Task<IEnumerable<JobDto>> GetJobsAsync(string? search, string? location, string? type, decimal? minSalary);
    Task<JobDto?> GetJobByIdAsync(int id);
    Task<JobDto?> CreateJobAsync(int recruiterId, CreateJobDto dto);
    Task<JobDto?> UpdateJobAsync(int jobId, int recruiterId, UpdateJobDto dto);
    Task<bool> DeleteJobAsync(int jobId, int userId, string role);
    Task<IEnumerable<JobDto>> GetJobsByRecruiterAsync(int recruiterId);
}

public class JobService : IJobService
{
    private readonly AppDbContext _context;

    public JobService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<JobDto>> GetJobsAsync(string? search, string? location, string? type, decimal? minSalary)
    {
        var query = _context.Jobs
            .Include(j => j.Recruiter).ThenInclude(u => u.RecruiterProfile)
            .Include(j => j.Applications)
            .Where(j => j.IsActive)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(j => j.Title.Contains(search) || j.Description.Contains(search) || j.Location.Contains(search));

        if (!string.IsNullOrWhiteSpace(location))
            query = query.Where(j => j.Location.Contains(location));

        if (!string.IsNullOrWhiteSpace(type) && Enum.TryParse<JobType>(type, true, out var jobType))
            query = query.Where(j => j.Type == jobType);

        if (minSalary.HasValue)
            query = query.Where(j => j.Salary >= minSalary.Value);

        var jobs = await query.OrderByDescending(j => j.PostedAt).ToListAsync();
        return jobs.Select(ToDto);
    }

    public async Task<JobDto?> GetJobByIdAsync(int id)
    {
        var job = await _context.Jobs
            .Include(j => j.Recruiter).ThenInclude(u => u.RecruiterProfile)
            .Include(j => j.Applications)
            .FirstOrDefaultAsync(j => j.Id == id);

        return job is null ? null : ToDto(job);
    }

    public async Task<JobDto?> CreateJobAsync(int recruiterId, CreateJobDto dto)
    {
        if (!Enum.TryParse<JobType>(dto.Type, true, out var jobType))
            jobType = JobType.FullTime;

        var job = new Job
        {
            Title       = dto.Title,
            Description = dto.Description,
            Location    = dto.Location,
            Salary      = dto.Salary,
            Type        = jobType,
            Requirements = dto.Requirements,
            RecruiterId = recruiterId,
            PostedAt    = DateTime.UtcNow,
            IsActive    = true
        };

        _context.Jobs.Add(job);
        await _context.SaveChangesAsync();
        return await GetJobByIdAsync(job.Id);
    }

    public async Task<JobDto?> UpdateJobAsync(int jobId, int recruiterId, UpdateJobDto dto)
    {
        var job = await _context.Jobs.FindAsync(jobId);
        if (job is null || job.RecruiterId != recruiterId) return null;

        if (dto.Title       is not null) job.Title       = dto.Title;
        if (dto.Description is not null) job.Description = dto.Description;
        if (dto.Location    is not null) job.Location    = dto.Location;
        if (dto.Salary      is not null) job.Salary      = dto.Salary;
        if (dto.Requirements is not null) job.Requirements = dto.Requirements;
        if (dto.IsActive    is not null) job.IsActive    = dto.IsActive.Value;
        if (dto.Type is not null && Enum.TryParse<JobType>(dto.Type, true, out var t))
            job.Type = t;

        await _context.SaveChangesAsync();
        return await GetJobByIdAsync(job.Id);
    }

    public async Task<bool> DeleteJobAsync(int jobId, int userId, string role)
    {
        var job = await _context.Jobs.FindAsync(jobId);
        if (job is null) return false;
        if (role != "Admin" && job.RecruiterId != userId) return false;

        _context.Jobs.Remove(job);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<JobDto>> GetJobsByRecruiterAsync(int recruiterId)
    {
        var jobs = await _context.Jobs
            .Include(j => j.Recruiter).ThenInclude(u => u.RecruiterProfile)
            .Include(j => j.Applications)
            .Where(j => j.RecruiterId == recruiterId)
            .OrderByDescending(j => j.PostedAt)
            .ToListAsync();

        return jobs.Select(ToDto);
    }

    // ── Mapping helper ────────────────────────────────────────────────────────
    private static JobDto ToDto(Job j) => new()
    {
        Id               = j.Id,
        Title            = j.Title,
        Description      = j.Description,
        Location         = j.Location,
        Salary           = j.Salary,
        Type             = j.Type.ToString(),
        CompanyName      = j.Recruiter?.RecruiterProfile?.CompanyName
                           ?? j.Recruiter?.Name
                           ?? "Unknown",
        RecruiterId      = j.RecruiterId,
        PostedAt         = j.PostedAt,
        IsActive         = j.IsActive,
        Requirements     = j.Requirements,
        ApplicationCount = j.Applications?.Count ?? 0
    };
}
