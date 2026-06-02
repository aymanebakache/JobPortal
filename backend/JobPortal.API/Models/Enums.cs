namespace JobPortal.API.Models;

public enum UserRole
{
    Admin,
    Recruiter,
    Candidate
}

public enum JobType
{
    FullTime,
    PartTime,
    Internship,
    Remote
}

public enum ApplicationStatus
{
    Pending,
    Accepted,
    Rejected
}
