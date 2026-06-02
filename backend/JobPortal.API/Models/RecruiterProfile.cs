namespace JobPortal.API.Models;

public class RecruiterProfile
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string CompanyDescription { get; set; } = string.Empty;
    public string? Website { get; set; }

    // Navigation
    public User User { get; set; } = null!;
}
