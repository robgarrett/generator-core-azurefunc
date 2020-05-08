using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.WebJobs.Extensions.Http;

namespace <%= namespace %>
{
    public class EchoFunc
    {
        [FunctionName("Echo")]
        public async Task<IActionResult> GetLinks([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "echo")] HttpRequest req, ILogger log)
        {
            return await Task<IActionResult>.Run(() =>
            {
                var msg = req.Query["msg"];
                var result = (!string.IsNullOrEmpty(msg)) ? $"Hello {msg}" : "Hello";
                return new OkObjectResult(result);
            });
        }
    }
}
