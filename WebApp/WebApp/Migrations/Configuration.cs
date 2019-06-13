namespace WebApp.Migrations
{
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Diagnostics;
    using System.Linq;
    using WebApp.Models;
    using WebApp.Persistence.Repository.ModelRepositories;
    using WebApp.Persistence.UnitOfWork;

    internal sealed class Configuration : DbMigrationsConfiguration<WebApp.Persistence.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }
        

        protected override void Seed(WebApp.Persistence.ApplicationDbContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data.

            if (!context.Roles.Any(r => r.Name == "Admin"))
            {
                var store = new RoleStore<IdentityRole>(context);
                var manager = new RoleManager<IdentityRole>(store);
                var role = new IdentityRole { Name = "Admin" };

                manager.Create(role);
            }

            if (!context.Roles.Any(r => r.Name == "Controller"))
            {
                var store = new RoleStore<IdentityRole>(context);
                var manager = new RoleManager<IdentityRole>(store);
                var role = new IdentityRole { Name = "Controller" };

                manager.Create(role);
            }

            if (!context.Roles.Any(r => r.Name == "AppUser"))
            {
                var store = new RoleStore<IdentityRole>(context);
                var manager = new RoleManager<IdentityRole>(store);
                var role = new IdentityRole { Name = "AppUser" };

                manager.Create(role);
            }

            var userStore = new UserStore<ApplicationUser>(context);
            var userManager = new UserManager<ApplicationUser>(userStore);

            if (!context.Users.Any(u => u.UserName == "admin@yahoo.com"))
            {
                var user = new ApplicationUser() { Id = "admin", UserName = "admin@yahoo.com", Email = "admin@yahoo.com", PasswordHash = ApplicationUser.HashPassword("Admin123!") };
                userManager.Create(user);
                userManager.AddToRole(user.Id, "Admin");
            }

            if(!context.Users.Any(u => u.UserName == "admin2@yahoo.com"))
            {
                var user = new ApplicationUser() { Id = "admin2", UserName = "admin2@yahoo.com", Email = "admin2@yahoo.com", PasswordHash = ApplicationUser.HashPassword("Admin123!") };
                userManager.Create(user);
                userManager.AddToRole(user.Id, "Admin");
            }

            if (!context.Users.Any(u => u.UserName == "appu@yahoo"))
            { 
                var user = new ApplicationUser() { Id = "appu", UserName = "appu@yahoo", Email = "appu@yahoo.com", PasswordHash = ApplicationUser.HashPassword("Appu123!") };
                userManager.Create(user);
                userManager.AddToRole(user.Id, "AppUser");
            }

            if (!context.Users.Any(u => u.UserName == "controlerOne"))
            {
                var user = new ApplicationUser() { Id = "controlerOne", UserName = "controlerOne", Email = "controlerOne@controler.com", PasswordHash = ApplicationUser.HashPassword("Controller123!") };
                userManager.Create(user);
                userManager.AddToRole(user.Id, "Controller");
            }

            if (!context.Users.Any(u => u.UserName == "controlerTwo"))
            {
                var user = new ApplicationUser() { Id = "controlerTwo", UserName = "controlerTwo", Email = "controlerTwo@controler.com", PasswordHash = ApplicationUser.HashPassword("Controller123!") };
                userManager.Create(user);
                userManager.AddToRole(user.Id, "Controller");
            }

            if (!context.Discounts.Any(d => d.DiscountTypeName == "Student"))
            {
                var discount = new Discount() { DiscountTypeName = "Student", DiscountCoeficient = 0.8 };
                context.Discounts.Add(discount);
                context.SaveChanges();
            }

            if (!context.Discounts.Any(d => d.DiscountTypeName == "Senior"))
            {
                var discount = new Discount() { DiscountTypeName = "Senior", DiscountCoeficient = 0.9 };
                context.Discounts.Add(discount);
                context.SaveChanges();
            }

            if (!context.Discounts.Any(d => d.DiscountTypeName == "Regular"))
            {
                var discount = new Discount() { DiscountTypeName = "Regular", DiscountCoeficient = 1 };
                context.Discounts.Add(discount);
                context.SaveChanges();
            }

            if (!context.TicketTypes.Any(tt => tt.TicketTypeName == "Hour"))
            {
                var ticketType = new TicketType() { TicketTypeName = "Hour" };
                context.TicketTypes.Add(ticketType);
                context.SaveChanges();
            }

            if (!context.TicketTypes.Any(tt => tt.TicketTypeName == "Day"))
            {
                var ticketType = new TicketType() { TicketTypeName = "Day" };
                context.TicketTypes.Add(ticketType);
                context.SaveChanges();
            }

            if (!context.TicketTypes.Any(tt => tt.TicketTypeName == "Week"))
            {
                var ticketType = new TicketType() { TicketTypeName = "Week" };
                context.TicketTypes.Add(ticketType);
                context.SaveChanges();
            }

            if (!context.TicketTypes.Any(tt => tt.TicketTypeName == "Year"))
            {
                var ticketType = new TicketType() { TicketTypeName = "Year" };
                context.TicketTypes.Add(ticketType);
                context.SaveChanges();
            }

            if (!context.Timetables.Any(tt => tt.IsUrban == true))
            {
                var timetable = new Timetable() { IsUrban = true };
                context.Timetables.Add(timetable);
                context.SaveChanges();
            }

            if (!context.Timetables.Any(tt => tt.IsUrban == false))
            {
                var timetable = new Timetable() { IsUrban = false };
                context.Timetables.Add(timetable);
                context.SaveChanges();
            }
        }
    }
}
