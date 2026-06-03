using JobPortal.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.API.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // 1. Seed Admin
        if (!await context.Users.AnyAsync(u => u.Role == UserRole.Admin))
        {
            var admin = new User
            {
                Name = "Admin",
                Email = "admin@jobportal.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Role = UserRole.Admin,
                CreatedAt = DateTime.UtcNow
            };
            context.Users.Add(admin);
            await context.SaveChangesAsync();
            Console.WriteLine("✅ Admin user seeded: admin@jobportal.com / Admin@123");
        }

        // Only seed demo data if the DB has few users (less than 5) to avoid blowing up on multiple restarts
        if (await context.Users.CountAsync() < 5)
        {
            Console.WriteLine("🌱 Seeding Demo Data...");

            var random = new Random(12345); // deterministic seed for consistency

            // 2. Seed 20 Recruiters
            var recruiters = new List<User>();
            var companyNames = new[] { "TechCorp", "InnovateX", "Global Systems", "Future Web", "CloudNet", "DataMatrix", "AI Solutions", "CyberDefend", "MobileWorks", "Quantum Logic", "FinTech Solutions", "HealthIT", "EduTech Group", "GreenEnergy Systems", "SmartCity Corp", "Alpha Software", "Beta Technologies", "Gamma Systems", "Delta Web", "Omega Corp" };
            
            for (int i = 0; i < 20; i++)
            {
                var r = new User
                {
                    Name = $"Recruiter {i + 1}",
                    Email = $"recruiter{i + 1}@example.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Recruiter@123"),
                    Role = UserRole.Recruiter,
                    CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 30)),
                    RecruiterProfile = new RecruiterProfile
                    {
                        CompanyName = companyNames[i % companyNames.Length],
                        CompanyDescription = "A leading tech company focused on innovation and excellence.",
                        Website = $"https://www.{companyNames[i % companyNames.Length].ToLower().Replace(" ", "")}.com"
                    }
                };
                recruiters.Add(r);
            }
            context.Users.AddRange(recruiters);
            await context.SaveChangesAsync(); // Save to get IDs

            // 3. Seed 20 Candidates
            var candidates = new List<User>();
            var skillsList = new[] { "React, Node.js, JS", "C#, .NET Core, SQL", "Java, Spring Boot", "Python, Django, AWS", "C++, Unreal Engine", "Swift, iOS", "Kotlin, Android", "Go, Kubernetes", "PHP, Laravel", "Ruby on Rails", "Angular, TypeScript", "Vue.js, Firebase", "AWS, Terraform, CI/CD", "Azure, PowerShell", "Docker, Linux", "Data Analysis, SQL, Python", "Machine Learning, TensorFlow", "Cybersecurity, Pen Testing", "QA, Selenium, Cypress", "Product Management, Agile" };
            
            for (int i = 0; i < 20; i++)
            {
                var c = new User
                {
                    Name = $"Candidate {i + 1}",
                    Email = $"candidate{i + 1}@example.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Candidate@123"),
                    Role = UserRole.Candidate,
                    CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 30)),
                    CandidateProfile = new CandidateProfile
                    {
                        Phone = $"+123456789{i:D2}",
                        Skills = skillsList[i % skillsList.Length],
                        Education = "Bachelor's Degree in Computer Science",
                        CVUrl = null
                    }
                };
                candidates.Add(c);
            }
            context.Users.AddRange(candidates);
            await context.SaveChangesAsync();

            // 4. Seed 20 Jobs
            var jobs = new List<Job>();
            var jobTitles = new[] { "Frontend Developer", "Backend Developer", "Full Stack Engineer", "DevOps Engineer", "Data Scientist", "Mobile Developer", "Cloud Architect", "Security Analyst", "System Admin", "QA Engineer", "Database Administrator", "UI/UX Designer", "Product Manager", "Machine Learning Engineer", "Network Engineer", "Technical Writer", "IT Support Specialist", "Business Analyst", "Scrum Master", "Software Architect" };
            var locations = new[] { "New York, NY", "San Francisco, CA", "Remote", "London, UK", "Berlin, Germany", "Toronto, Canada", "Austin, TX", "Seattle, WA" };
            
            for (int i = 0; i < 20; i++)
            {
                var j = new Job
                {
                    Title = jobTitles[i % jobTitles.Length],
                    Description = "We are looking for an experienced professional to join our team. You will be responsible for building high-quality solutions, collaborating with cross-functional teams, and driving innovation.",
                    Location = locations[random.Next(locations.Length)],
                    Salary = random.Next(60, 150) * 1000,
                    Type = (JobType)random.Next(0, 4),
                    RecruiterId = recruiters[random.Next(recruiters.Count)].Id,
                    PostedAt = DateTime.UtcNow.AddDays(-random.Next(1, 15)),
                    IsActive = true,
                    Requirements = "3+ years of experience. Strong problem-solving skills. Excellent communication."
                };
                jobs.Add(j);
            }
            context.Jobs.AddRange(jobs);
            await context.SaveChangesAsync();

            // 5. Seed 40 Applications
            var applications = new List<Application>();
            for (int i = 0; i < 40; i++)
            {
                var app = new Application
                {
                    JobId = jobs[random.Next(jobs.Count)].Id,
                    CandidateId = candidates[random.Next(candidates.Count)].Id,
                    Status = (ApplicationStatus)random.Next(0, 3), // Pending, Accepted, Rejected
                    AppliedAt = DateTime.UtcNow.AddDays(-random.Next(1, 10)),
                    CoverLetter = "I am highly interested in this position and believe my skills align perfectly with your requirements."
                };
                // Ensure no duplicate applications for the same job and candidate
                if (!applications.Any(a => a.JobId == app.JobId && a.CandidateId == app.CandidateId))
                {
                    applications.Add(app);
                }
            }
            context.Applications.AddRange(applications);
            await context.SaveChangesAsync();

            Console.WriteLine("✅ Demo data seeded successfully!");
        }
    }
}
