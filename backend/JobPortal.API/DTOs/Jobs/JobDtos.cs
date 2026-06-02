using System.ComponentModel.DataAnnotations;

namespace JobPortal.API.DTOs.Jobs;

public class JobDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public decimal? Salary { get; set; }
    public string Type { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public int RecruiterId { get; set; }
    public DateTime PostedAt { get; set; }
    public bool IsActive { get; set; }
    public string? Requirements { get; set; }
    public int ApplicationCount { get; set; }
}

public class CreateJobDto
{
    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public string Location { get; set; } = string.Empty;

    public decimal? Salary { get; set; }

    [Required]
    public string Type { get; set; } = "FullTime";

    public string? Requirements { get; set; }
}

public class UpdateJobDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Location { get; set; }
    public decimal? Salary { get; set; }
    public string? Type { get; set; }
    public string? Requirements { get; set; }
    public bool? IsActive { get; set; }
}
