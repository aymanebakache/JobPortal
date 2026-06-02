using JobPortal.API.Data;
using JobPortal.API.DTOs.Profile;
using JobPortal.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.API.Services;

public interface IProfileService
{
    Task<CandidateProfileDto?> GetCandidateProfileAsync(int userId);
    Task<CandidateProfileDto?> UpdateCandidateProfileAsync(int userId, UpdateCandidateProfileDto dto);
    Task<RecruiterProfileDto?> GetRecruiterProfileAsync(int userId);
    Task<RecruiterProfileDto?> UpdateRecruiterProfileAsync(int userId, UpdateRecruiterProfileDto dto);
    Task<string?> UploadCvAsync(int userId, string fileName, Stream fileStream);
}

public class ProfileService : IProfileService
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public ProfileService(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    public async Task<CandidateProfileDto?> GetCandidateProfileAsync(int userId)
    {
        var profile = await _context.CandidateProfiles
            .Include(cp => cp.User)
            .FirstOrDefaultAsync(cp => cp.UserId == userId);

        if (profile == null) return null;

        return ToDto(profile);
    }

    public async Task<CandidateProfileDto?> UpdateCandidateProfileAsync(int userId, UpdateCandidateProfileDto dto)
    {
        var profile = await _context.CandidateProfiles
            .Include(cp => cp.User)
            .FirstOrDefaultAsync(cp => cp.UserId == userId);

        if (profile == null) return null;

        // Update fields if provided
        if (dto.Name != null) profile.User.Name = dto.Name;
        if (dto.Phone != null) profile.Phone = dto.Phone;
        if (dto.Skills != null) profile.Skills = dto.Skills;
        if (dto.Education != null) profile.Education = dto.Education;

        await _context.SaveChangesAsync();
        return ToDto(profile);
    }

    public async Task<RecruiterProfileDto?> GetRecruiterProfileAsync(int userId)
    {
        var profile = await _context.RecruiterProfiles
            .Include(rp => rp.User)
            .FirstOrDefaultAsync(rp => rp.UserId == userId);

        if (profile == null) return null;

        return ToDto(profile);
    }

    public async Task<RecruiterProfileDto?> UpdateRecruiterProfileAsync(int userId, UpdateRecruiterProfileDto dto)
    {
        var profile = await _context.RecruiterProfiles
            .Include(rp => rp.User)
            .FirstOrDefaultAsync(rp => rp.UserId == userId);

        if (profile == null) return null;

        // Update fields if provided
        if (dto.Name != null) profile.User.Name = dto.Name;
        if (dto.CompanyName != null) profile.CompanyName = dto.CompanyName;
        if (dto.CompanyDescription != null) profile.CompanyDescription = dto.CompanyDescription;
        if (dto.Website != null) profile.Website = dto.Website;

        await _context.SaveChangesAsync();
        return ToDto(profile);
    }

    public async Task<string?> UploadCvAsync(int userId, string fileName, Stream fileStream)
    {
        var profile = await _context.CandidateProfiles.FirstOrDefaultAsync(cp => cp.UserId == userId);
        if (profile == null) return null;

        // Safely determine web root path with fallback if it is null
        var webRootPath = _env.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRootPath))
        {
            webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        }

        // Ensure directories exist
        var uploadsDir = Path.Combine(webRootPath, "uploads", "cvs");
        if (!Directory.Exists(uploadsDir))
        {
            Directory.CreateDirectory(uploadsDir);
        }

        // Generate unique name
        var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(fileName)}";
        var filePath = Path.Combine(uploadsDir, uniqueFileName);

        // Save file to filesystem
        using (var ws = new FileStream(filePath, FileMode.Create))
        {
            await fileStream.CopyToAsync(ws);
        }

        // Save clean web-relative path
        var cvUrl = $"/uploads/cvs/{uniqueFileName}";
        profile.CVUrl = cvUrl;
        await _context.SaveChangesAsync();

        return cvUrl;
    }

    // ── Mapping Helpers ──────────────────────────────────────────────────────

    private static CandidateProfileDto ToDto(CandidateProfile cp) => new()
    {
        UserId = cp.UserId,
        Name = cp.User.Name,
        Email = cp.User.Email,
        Phone = cp.Phone,
        Skills = cp.Skills,
        Education = cp.Education,
        CVUrl = cp.CVUrl
    };

    private static RecruiterProfileDto ToDto(RecruiterProfile rp) => new()
    {
        UserId = rp.UserId,
        Name = rp.User.Name,
        Email = rp.User.Email,
        CompanyName = rp.CompanyName,
        CompanyDescription = rp.CompanyDescription,
        Website = rp.Website
    };
}
