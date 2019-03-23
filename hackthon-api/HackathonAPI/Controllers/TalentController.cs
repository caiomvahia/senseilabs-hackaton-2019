using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HackathonAPI.Models;

namespace HackathonAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TalentController : ControllerBase
    {
        private readonly HackathonAPIContext _context;

        public TalentController(HackathonAPIContext context)
        {
            _context = context;

            if(_context.Talents.Count() == 0)
            {
                _context.Talents.Add(new Talent { 
                                                    ID = 1,
                                                    Name = "Cesar",
                                                    HourlyRate = 45.50,
                                                    Role = "Back-end developer",
                                                    Level = "L2",
                                                    Rating = 4,
                                                    ActiveProject = null
                                                });

                _context.Talents.Add(new Talent { 
                                                    ID = 2,
                                                    Name = "Caio",
                                                    HourlyRate = 50.0,
                                                    Role = "Full-stack developer",
                                                    Level = "L3",
                                                    Rating = 4,
                                                    ActiveProject = null
                                                });
                _context.SaveChanges();
            }
        }
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Talent>>> GetTalents()
        {
            return await _context.Talents.ToListAsync();
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Talent>> GetTalent(int id)
        {
            var talent = await _context.Talents.FindAsync(id);

            if (talent != null)
                return NotFound();

            return talent;
        }

        // Create methods for filters
    }
}