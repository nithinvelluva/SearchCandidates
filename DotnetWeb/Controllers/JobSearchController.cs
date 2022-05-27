using DotnetWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using System.Linq;

namespace DotnetWeb.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class JobSearchController : ControllerBase
    {
        public JobSearchController()
        {
        }

        [HttpGet]
        public async Task<IEnumerable<Skill>> GetSkills()
        {
            List<Skill> skills = new List<Skill>();
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync("https://app.ifs.aero/EternalBlue/api/technologies"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    skills = JsonConvert.DeserializeObject<List<Skill>>(apiResponse);
                }
            }
            return skills;
        }

        [HttpPost("search")]
        public async Task<IEnumerable<Candidate>> Search([FromBody] SearchRequest request)
        {
            List<Candidate> candidates = new List<Candidate>();
            List<Candidate> candidatesFiltered = new List<Candidate>();
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync("https://app.ifs.aero/EternalBlue/api/candidates"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    candidates = JsonConvert.DeserializeObject<List<Candidate>>(apiResponse);
                }
            }
            //foreach (var item in candidates)
            //{                
            //    var res = item.experience.Where(e => request.Skills.Contains(e.technologyId)
            //            && e.yearsOfExperience == request.Experience).ToList();
            //}
            candidatesFiltered = candidates.FindAll(c => c.experience.Any(e => request.Skills.Contains(e.technologyId)
                        && e.yearsOfExperience == request.Experience));
            return candidatesFiltered;
        }
    }
}
