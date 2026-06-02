namespace JobPortal.API.Models;

public class Application
{
    public int Id { get; set; }
    public int JobId { get; set; }
    public int CandidateId { get; set; }
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;
    public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
    public string? CoverLetter { get; set; }

    // Navigation
    public Job Job { get; set; } = null!;
    public User Candidate { get; set; } = null!;
}
