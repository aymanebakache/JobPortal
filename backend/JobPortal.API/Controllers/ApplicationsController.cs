using System.Security.Claims;
using JobPortal.API.DTOs.Applications;
using JobPortal.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobPortal.API.Controllers;

[ApiController]
[Route("api/applications")]
[Authorize]
public class ApplicationsController : ControllerBase
{
    private readonly IApplicationService _applicationService;

    public System.Security.Claims.ClaimsPrincipal Principal => User;

    public ApplicationsController(IApplicationService applicationService)
    {
        _applicationService = applicationService;
    }

    [Authorize(Roles = "Candidate")]
    [HttpPost]
    public async Task<IActionResult> Apply([FromBody] CreateApplicationDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var candidateId = GetUserId();
        var application = await _applicationService.ApplyAsync(candidateId, dto);
        if (application == null)
            return BadRequest(new { message = "Could not apply for job. You may have already applied, or the job is inactive/does not exist." });

        return Ok(application);
    }

    [Authorize(Roles = "Candidate")]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyApplications()
    {
        var candidateId = GetUserId();
        var applications = await _applicationService.GetCandidateApplicationsAsync(candidateId);
        return Ok(applications);
    }

    [Authorize(Roles = "Recruiter")]
    [HttpGet("job/{jobId:int}")]
    public async Task<IActionResult> GetJobApplications(int jobId)
    {
        var recruiterId = GetUserId();
        var applications = await _applicationService.GetJobApplicationsAsync(jobId, recruiterId);
        if (applications == null)
            return Forbid(); // recruiter doesn't own this job or job doesn't exist

        return Ok(applications);
    }

    [Authorize(Roles = "Recruiter")]
    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var recruiterId = GetUserId();
        var result = await _applicationService.UpdateApplicationStatusAsync(id, recruiterId, dto);
        if (result == null)
            return NotFound(new { message = "Application not found, or you are not authorized to update its status, or the status is invalid." });

        return Ok(result);
    }

    // Helpers
    private int GetUserId()
    {
        var claim = User.FindFirst("userId")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(claim, out var id) ? id : 0;
    }
}
