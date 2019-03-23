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
        public async Task<ActionResult<IEnumerable<Talent>>> GetAllTalents()
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

        // [HttpGet("{id}")]
        // public async Task<ActionResult<Talent>> GetTalent(string role, string level, int rating)
        // {
        //     var talent = await _context.Talents.Select()

        //     if (talent != null)
        //         return NotFound();

        //     return talent;
        // }

        [HttpPost]
        public async Task<ActionResult<Cart>> AddToCart(Talent talent)
        {
            var cart = await _context.Cart.FirstAsync();

            if(cart is null)
                cart = new Cart() {ID=1, Talents = new List<Talent>()};

            cart.Talents.Add(talent);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTalent), new {ID = talent.ID}, talent);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            var talent = await _context.Talents.FindAsync(id);
            var cart = await _context.Cart.FirstAsync();

            if(talent == null || cart == null)
                return NotFound();

            cart.Talents.Remove(talent);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}