using System.Security.Claims;
using JobPortal.API.DTOs.Jobs;
using JobPortal.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobPortal.API.Controllers;

[ApiController]
[Route("api/jobs")]
public class JobsController : ControllerBase
{
    private readonly IJobService _jobService;

    public JobsController(IJobService jobService)
    {
        _jobService = jobService;
    }

    [HttpGet]
    public async Task<IActionResult> GetJobs(
        [FromQuery] string? search,
        [FromQuery] string? location,
        [FromQuery] string? type,
        [FromQuery] decimal? minSalary)
    {
        var jobs = await _jobService.GetJobsAsync(search, location, type, minSalary);
        return Ok(jobs);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetJobById(int id)
    {
        var job = await _jobService.GetJobByIdAsync(id);
        if (job == null)
            return NotFound(new { message = $"Job with ID {id} not found." });

        return Ok(job);
    }

    [Authorize(Roles = "Recruiter")]
    [HttpPost]
    public async Task<IActionResult> CreateJob([FromBody] CreateJobDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var recruiterId = GetUserId();
        var job = await _jobService.CreateJobAsync(recruiterId, dto);
        if (job == null)
            return BadRequest(new { message = "Could not create job offer." });

        return CreatedAtAction(nameof(GetJobById), new { id = job.Id }, job);
    }

    [Authorize(Roles = "Recruiter")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateJob(int id, [FromBody] UpdateJobDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var recruiterId = GetUserId();
        var job = await _jobService.UpdateJobAsync(id, recruiterId, dto);
        if (job == null)
            return NotFound(new { message = "Job not found or you are not authorized to edit this job." });

        return Ok(job);
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteJob(int id)
    {
        var userId = GetUserId();
        var role = GetUserRole();

        var success = await _jobService.DeleteJobAsync(id, userId, role);
        if (!success)
            return NotFound(new { message = "Job not found or you are not authorized to delete this job." });

        return Ok(new { message = "Job deleted successfully." });
    }

    [Authorize(Roles = "Recruiter")]
    [HttpGet("recruiter/my")]
    public async Task<IActionResult> GetMyJobs()
    {
        var recruiterId = GetUserId();
        var jobs = await _jobService.GetJobsByRecruiterAsync(recruiterId);
        return Ok(jobs);
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
