using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using System.Text;
using System.Text.Json;

namespace TaskManagerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AiController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AiController(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    [HttpGet("prioritize")]
    public async Task<IActionResult> Prioritize()
    {
        var tasks = await _db.Tasks
            .Where(t => !t.IsCompleted)
            .OrderBy(t => t.Deadline)
            .ToListAsync();

        if (!tasks.Any())
            return Ok(new { result = "No pending tasks to prioritize." });

        var taskList = string.Join("\n", tasks.Select((t, i) =>
            $"{i + 1}. [ID:{t.Id}] [{t.Priority.ToUpper()}] {t.Title} — due {t.Deadline:MMM dd yyyy} — {t.Description}"));

        var prompt = $@"You are a smart task prioritization assistant.
Here are the user's pending tasks:

{taskList}

Analyze urgency (deadline proximity), importance (priority label), and impact.
Return a JSON array where each object has:
- ""taskId"": the task ID (integer)
- ""rank"": suggested order to tackle it (1 = do first)
- ""reason"": one clear sentence explaining why

Respond ONLY with a valid JSON array. No markdown fences, no extra text.";

        var apiKey = _config["HuggingFace:ApiKey"];

        if (string.IsNullOrEmpty(apiKey) || apiKey == "YOUR_HF_API_KEY_HERE")
        {
            // Demo mode: return mock prioritization when no key is set
            var mockResult = tasks
                .OrderBy(t => t.Priority == "high" ? 0 : t.Priority == "medium" ? 1 : 2)
                .ThenBy(t => t.Deadline)
                .Select((t, i) => new
                {
                    taskId = t.Id,
                    rank = i + 1,
                    reason = $"[Demo mode] Ranked by priority ({t.Priority}) and deadline ({t.Deadline:MMM dd})."
                });
            return Ok(new { result = System.Text.Json.JsonSerializer.Serialize(mockResult), tasks, mode = "demo" });
        }

        var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

        var payload = JsonSerializer.Serialize(new
        {
            model = "mistralai/Mistral-7B-Instruct-v0.2",
            messages = new[] { new { role = "user", content = prompt } },
            max_tokens = 600,
            temperature = 0.3
        });

        try
        {
            var response = await client.PostAsync(
                "https://api-inference.huggingface.co/v1/chat/completions",
                new StringContent(payload, Encoding.UTF8, "application/json"));

            var raw = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(raw);
            var aiText = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            return Ok(new { result = aiText, tasks, mode = "ai" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "AI call failed", detail = ex.Message });
        }
    }
}
