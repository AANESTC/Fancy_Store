using FancyStore.API.Data;
using FancyStore.API.DTOs;
using FancyStore.API.Models;
using FancyStore.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FancyStore.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IJwtService _jwtService;

    public AuthController(AppDbContext context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto model)
    {
        if (await _context.Users.AnyAsync(u => u.Email == model.Email || u.Mobile == model.Mobile))
            return BadRequest(new { message = "Email or Mobile already registered" });

        var user = new User
        {
            Name = model.Name,
            Email = model.Email,
            Mobile = model.Mobile,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = _jwtService.GenerateToken(user);
        return Ok(new AuthResponseDto { Token = token, Role = user.Role, UserId = user.UserId, Name = user.Name, Email = user.Email });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto model)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password" });

        if (user.IsBlocked)
            return Unauthorized(new { message = "Account blocked" });

        var token = _jwtService.GenerateToken(user);
        return Ok(new AuthResponseDto { Token = token, Role = user.Role, UserId = user.UserId, Name = user.Name, Email = user.Email });
    }

    [HttpGet("update-admin")]
    public async Task<IActionResult> UpdateAdmin()
    {
        var admin = await _context.Users.FirstOrDefaultAsync(u => u.Email == "admin@gmail.com");
        if (admin != null)
        {
            admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin@123");
            await _context.SaveChangesAsync();
        }
        return Ok("Admin password updated");
    }
}
