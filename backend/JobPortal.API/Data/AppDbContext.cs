using JobPortal.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<CandidateProfile> CandidateProfiles => Set<CandidateProfile>();
    public DbSet<RecruiterProfile> RecruiterProfiles => Set<RecruiterProfile>();
    public DbSet<Job> Jobs => Set<Job>();
    public DbSet<Application> Applications => Set<Application>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User → CandidateProfile (1-to-1)
        modelBuilder.Entity<CandidateProfile>()
            .HasOne(cp => cp.User)
            .WithOne(u => u.CandidateProfile)
            .HasForeignKey<CandidateProfile>(cp => cp.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // User → RecruiterProfile (1-to-1)
        modelBuilder.Entity<RecruiterProfile>()
            .HasOne(rp => rp.User)
            .WithOne(u => u.RecruiterProfile)
            .HasForeignKey<RecruiterProfile>(rp => rp.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Recruiter → Jobs (1-to-many)
        modelBuilder.Entity<Job>()
            .HasOne(j => j.Recruiter)
            .WithMany(u => u.PostedJobs)
            .HasForeignKey(j => j.RecruiterId)
            .OnDelete(DeleteBehavior.Cascade);

        // Job → Applications (1-to-many)
        modelBuilder.Entity<Application>()
            .HasOne(a => a.Job)
            .WithMany(j => j.Applications)
            .HasForeignKey(a => a.JobId)
            .OnDelete(DeleteBehavior.Cascade);

        // Candidate → Applications (1-to-many, no cascade to avoid multiple cascade paths)
        modelBuilder.Entity<Application>()
            .HasOne(a => a.Candidate)
            .WithMany(u => u.Applications)
            .HasForeignKey(a => a.CandidateId)
            .OnDelete(DeleteBehavior.NoAction);

        // Unique email
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Decimal precision
        modelBuilder.Entity<Job>()
            .Property(j => j.Salary)
            .HasPrecision(18, 2);
    }
}
