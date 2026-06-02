using System.Security.Claims;
using JobPortal.API.DTOs.Profile;
using JobPortal.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobPortal.API.Controllers;

[ApiController]
[Route("api/profile")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly IProfileService _profileService;

    public ProfileController(IProfileService profileService)
    {
        _profileService = profileService;
    }

    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetUserId();
        var role = GetUserRole();

        if (role == "Candidate")
        {
            var profile = await _profileService.GetCandidateProfileAsync(userId);
            if (profile == null) return NotFound(new { message = "Profile not found." });
            return Ok(new { role, profile });
        }
        else if (role == "Recruiter")
        {
            var profile = await _profileService.GetRecruiterProfileAsync(userId);
            if (profile == null) return NotFound(new { message = "Profile not found." });
            return Ok(new { role, profile });
        }

        return BadRequest(new { message = "Invalid role for retrieving profiles." });
    }

    [Authorize(Roles = "Candidate")]
    [HttpPut("candidate")]
    public async Task<IActionResult> UpdateCandidateProfile([FromBody] UpdateCandidateProfileDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = GetUserId();
        var profile = await _profileService.UpdateCandidateProfileAsync(userId, dto);
        if (profile == null)
            return NotFound(new { message = "Candidate profile not found." });

        return Ok(profile);
    }

    [Authorize(Roles = "Recruiter")]
    [HttpPut("recruiter")]
    public async Task<IActionResult> UpdateRecruiterProfile([FromBody] UpdateRecruiterProfileDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = GetUserId();
        var profile = await _profileService.UpdateRecruiterProfileAsync(userId, dto);
        if (profile == null)
            return NotFound(new { message = "Recruiter profile not found." });

        return Ok(profile);
    }

    [Authorize(Roles = "Candidate")]
    [HttpPost("upload-cv")]
    public async Task<IActionResult> UploadCv(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No file uploaded." });

        if (Path.GetExtension(file.FileName).ToLower() != ".pdf")
            return BadRequest(new { message = "Only PDF files are allowed." });

        var userId = GetUserId();
        
        using (var stream = file.OpenReadStream())
        {
            var cvUrl = await _profileService.UploadCvAsync(userId, file.FileName, stream);
            if (cvUrl == null)
                return NotFound(new { message = "Candidate profile not found." });

            return Ok(new { cvUrl });
        }
    }

    // Helpers
    private int GetUserId()
    {
        var claim = User.FindFirst("userId")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(claim, out var id) ? id : 0;
    }

    private string GetUserRole()
    {
        return User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;
    }
}
