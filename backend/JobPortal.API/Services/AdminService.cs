using JobPortal.API.Data;
using JobPortal.API.DTOs.Admin;
using JobPortal.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.API.Services;

public interface IAdminService
{
    Task<IEnumerable<UserAdminDto>> GetAllUsersAsync();
    Task<bool> DeleteUserAsync(int userId);
    Task<StatsDto> GetStatsAsync();
}

public class AdminService : IAdminService
{
    private readonly AppDbContext _context;

    public AdminService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserAdminDto>> GetAllUsersAsync()
    {
        var users = await _context.Users
            .Where(u => u.Role != UserRole.Admin)
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync();

        return users.Select(u => new UserAdminDto
        {
            Id = u.Id,
            Name = u.Name,
            Email = u.Email,
            Role = u.Role.ToString(),
            CreatedAt = u.CreatedAt
        });
    }

    public async Task<bool> DeleteUserAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null || user.Role == UserRole.Admin) return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<StatsDto> GetStatsAsync()
    {
        var totalUsers = await _context.Users.CountAsync();
        var totalCandidates = await _context.Users.CountAsync(u => u.Role == UserRole.Candidate);
        var totalRecruiters = await _context.Users.CountAsync(u => u.Role == UserRole.Recruiter);
        var totalJobs = await _context.Jobs.CountAsync();
        var activeJobs = await _context.Jobs.CountAsync(j => j.IsActive);
        var totalApplications = await _context.Applications.CountAsync();
        var pendingApplications = await _context.Applications.CountAsync(a => a.Status == ApplicationStatus.Pending);
        var acceptedApplications = await _context.Applications.CountAsync(a => a.Status == ApplicationStatus.Accepted);
        var rejectedApplications = await _context.Applications.CountAsync(a => a.Status == ApplicationStatus.Rejected);

        return new StatsDto
        {
            TotalUsers = totalUsers,
            TotalCandidates = totalCandidates,
            TotalRecruiters = totalRecruiters,
            TotalJobs = totalJobs,
            ActiveJobs = activeJobs,
            TotalApplications = totalApplications,
            PendingApplications = pendingApplications,
            AcceptedApplications = acceptedApplications,
            RejectedApplications = rejectedApplications
        };
    }
}
