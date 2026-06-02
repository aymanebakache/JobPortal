namespace JobPortal.API.Services;

public interface IEmailService
{
    Task SendApplicationConfirmationAsync(string candidateEmail, string jobTitle, string companyName);
    Task SendStatusUpdateAsync(string candidateEmail, string jobTitle, string status);
}

/// <summary>Mock email service — logs to console. Replace with real SMTP for production.</summary>
public class MockEmailService : IEmailService
{
    private readonly ILogger<MockEmailService> _logger;

    public MockEmailService(ILogger<MockEmailService> logger) => _logger = logger;

    public Task SendApplicationConfirmationAsync(string candidateEmail, string jobTitle, string companyName)
    {
        _logger.LogInformation(
            "[MOCK EMAIL] To: {Email} | Subject: Application Received | " +
            "Body: You have successfully applied for '{Job}' at {Company}.",
            candidateEmail, jobTitle, companyName);
        return Task.CompletedTask;
    }

    public Task SendStatusUpdateAsync(string candidateEmail, string jobTitle, string status)
    {
        _logger.LogInformation(
            "[MOCK EMAIL] To: {Email} | Subject: Application Update | " +
            "Body: Your application for '{Job}' is now {Status}.",
            candidateEmail, jobTitle, status);
        return Task.CompletedTask;
    }
}
