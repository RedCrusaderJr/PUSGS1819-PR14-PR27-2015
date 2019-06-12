namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TimetableEntryIdtoAutoincrement : DbMigration
    {
        public override void Up()
        {
            DropPrimaryKey("dbo.TimetableEntries");
            AlterColumn("dbo.TimetableEntries", "TimetableEntryId", c => c.Int(nullable: false, identity: true));
            AddPrimaryKey("dbo.TimetableEntries", "TimetableEntryId");
        }
        
        public override void Down()
        {
            DropPrimaryKey("dbo.TimetableEntries");
            AlterColumn("dbo.TimetableEntries", "TimetableEntryId", c => c.String(nullable: false, maxLength: 128));
            AddPrimaryKey("dbo.TimetableEntries", "TimetableEntryId");
        }
    }
}
