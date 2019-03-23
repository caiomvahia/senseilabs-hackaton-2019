using System;

namespace HackathonAPI.Models
{
    public class Talent
    {
        public int ID {get;set;}
        public string Name {get;set;}
        public double HourlyRate{get;set;}
        public string Role {get;set;}
        public string Level {get;set;}
        public int Rating {get;set;}
        public Project ActiveProject{get;set;}
    }

    public class Project
    {
        public int ID {get;set;}
        public DateTime StartDate {get;set;}
        public DateTime EndDate {get;set;}
    }
}