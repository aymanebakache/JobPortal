namespace JobPortal.API.DTOs.Profile;

public class CandidateProfileDto
{
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty;
    public string Education { get; set; } = string.Empty;
    public string? CVUrl { get; set; }
}

public class UpdateCandidateProfileDto
{
    public string? Name { get; set; }
    public string? Phone { get; set; }
    public string? Skills { get; set; }
    public string? Education { get; set; }
}

public class RecruiterProfileDto
{
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string CompanyDescription { get; set; } = string.Empty;
    public string? Website { get; set; }
}

public class UpdateRecruiterProfileDto
{
    public string? Name { get; set; }
    public string? CompanyName { get; set; }
    public string? CompanyDescription { get; set; }
    public string? Website { get; set; }
}
