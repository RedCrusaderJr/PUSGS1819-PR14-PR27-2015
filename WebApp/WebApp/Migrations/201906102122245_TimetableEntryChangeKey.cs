namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TimetableEntryChangeKey : DbMigration
    {
        public override void Up()
        {
            DropPrimaryKey("dbo.TimetableEntries");
            AddColumn("dbo.TimetableEntries", "Id", c => c.Int(nullable: false, identity: true));
            AddPrimaryKey("dbo.TimetableEntries", "Id");
            DropColumn("dbo.TimetableEntries", "TimeTableEntryId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.TimetableEntries", "TimeTableEntryId", c => c.Int(nullable: false, identity: true));
            DropPrimaryKey("dbo.TimetableEntries");
            DropColumn("dbo.TimetableEntries", "Id");
            AddPrimaryKey("dbo.TimetableEntries", "TimeTableEntryId");
        }
    }
}
