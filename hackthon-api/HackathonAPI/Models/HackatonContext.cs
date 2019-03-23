using Microsoft.EntityFrameworkCore;

namespace HackathonAPI.Models
{
        public class HackathonAPIContext : DbContext
    {
        public HackathonAPIContext(DbContextOptions<HackathonAPIContext> options) : base (options)
        {

        }

        public DbSet<Talent> Talents {get;set;}
        public DbSet<Cart> Cart {get;set;}
    }
}