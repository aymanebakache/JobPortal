namespace JobPortal.API.Models;

public class CandidateProfile
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty;
    public string Education { get; set; } = string.Empty;
    public string? CVUrl { get; set; }

    // Navigation
    public User User { get; set; } = null!;
}
