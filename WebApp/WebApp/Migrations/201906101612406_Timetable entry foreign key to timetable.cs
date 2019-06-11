namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Timetableentryforeignkeytotimetable : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.TimetableEntries", "Timetable_IsUrban", "dbo.Timetables");
            DropIndex("dbo.TimetableEntries", new[] { "Timetable_IsUrban" });
            RenameColumn(table: "dbo.TimetableEntries", name: "Timetable_IsUrban", newName: "TimetableId");
            AlterColumn("dbo.TimetableEntries", "TimetableId", c => c.Boolean(nullable: false));
            CreateIndex("dbo.TimetableEntries", "TimetableId");
            AddForeignKey("dbo.TimetableEntries", "TimetableId", "dbo.Timetables", "IsUrban", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.TimetableEntries", "TimetableId", "dbo.Timetables");
            DropIndex("dbo.TimetableEntries", new[] { "TimetableId" });
            AlterColumn("dbo.TimetableEntries", "TimetableId", c => c.Boolean());
            RenameColumn(table: "dbo.TimetableEntries", name: "TimetableId", newName: "Timetable_IsUrban");
            CreateIndex("dbo.TimetableEntries", "Timetable_IsUrban");
            AddForeignKey("dbo.TimetableEntries", "Timetable_IsUrban", "dbo.Timetables", "IsUrban");
        }
    }
}
