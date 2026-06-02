namespace JobPortal.API.Models;

public class Job
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public decimal? Salary { get; set; }
    public JobType Type { get; set; } = JobType.FullTime;
    public int RecruiterId { get; set; }
    public DateTime PostedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    public string? Requirements { get; set; }

    // Navigation
    public User Recruiter { get; set; } = null!;
    public ICollection<Application> Applications { get; set; } = [];
}
