namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class BusMigration : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Autobus", "Position", c => c.String());
            AddColumn("dbo.Autobus", "LineId", c => c.String(maxLength: 128));
            CreateIndex("dbo.Autobus", "LineId");
            AddForeignKey("dbo.Autobus", "LineId", "dbo.Lines", "OrderNumber");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Autobus", "LineId", "dbo.Lines");
            DropIndex("dbo.Autobus", new[] { "LineId" });
            DropColumn("dbo.Autobus", "LineId");
            DropColumn("dbo.Autobus", "Position");
        }
    }
}
