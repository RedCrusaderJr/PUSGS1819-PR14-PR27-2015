namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ticketvalidation : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Tickets", "IsValid", c => c.Boolean(nullable: false));
            AddColumn("dbo.TimetableEntries", "Timetable_IsUrban", c => c.Boolean());
            CreateIndex("dbo.TimetableEntries", "Timetable_IsUrban");
            AddForeignKey("dbo.TimetableEntries", "Timetable_IsUrban", "dbo.Timetables", "IsUrban");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.TimetableEntries", "Timetable_IsUrban", "dbo.Timetables");
            DropIndex("dbo.TimetableEntries", new[] { "Timetable_IsUrban" });
            DropColumn("dbo.TimetableEntries", "Timetable_IsUrban");
            DropColumn("dbo.Tickets", "IsValid");
        }
    }
}
