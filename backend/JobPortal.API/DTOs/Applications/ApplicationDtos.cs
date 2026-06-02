using System.ComponentModel.DataAnnotations;

namespace JobPortal.API.DTOs.Applications;

public class ApplicationDto
{
    public int Id { get; set; }
    public int JobId { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public int CandidateId { get; set; }
    public string CandidateName { get; set; } = string.Empty;
    public string CandidateEmail { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime AppliedAt { get; set; }
    public string? CoverLetter { get; set; }
    public string? CVUrl { get; set; }
}

public class CreateApplicationDto
{
    [Required]
    public int JobId { get; set; }
    public string? CoverLetter { get; set; }
}

public class UpdateStatusDto
{
    [Required]
    public string Status { get; set; } = string.Empty;
}
