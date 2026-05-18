using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite("Data Source=tasks.db"));

builder.Services.AddCors(options =>
    options.AddPolicy("AllowReact", p =>
        p.WithOrigins("http://localhost:5173")
         .AllowAnyMethod()
         .AllowAnyHeader()));

builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("AllowReact");
app.MapControllers();

// Auto-create the SQLite database on first run
using (var scope = app.Services.CreateScope())
    scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.EnsureCreated();

app.Run();
