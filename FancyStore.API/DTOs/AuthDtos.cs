namespace FancyStore.API.DTOs;

public record RegisterDto(string Name, string Email, string Mobile, string Password);
public record LoginDto(string Email, string Password);
public record OtpRequestDto(string Mobile);
public record OtpVerifyDto(string Mobile, string Otp);

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

public class UserDto
{
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Mobile { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool IsBlocked { get; set; }
    public DateTime CreatedAt { get; set; }
    public int OrderCount { get; set; }
}

public record UpdateProfileDto(string Name, string Email, string Mobile);
public record ChangePasswordDto(string CurrentPassword, string NewPassword);
