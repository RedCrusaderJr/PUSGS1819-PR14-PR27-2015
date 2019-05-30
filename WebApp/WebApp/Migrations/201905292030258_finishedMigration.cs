namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class finishedMigration : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.StationLines", "Line_OrderNumber", "dbo.Lines");
            DropForeignKey("dbo.TimetableEntries", "LineId", "dbo.Lines");
            DropPrimaryKey("dbo.Lines");
            AlterColumn("dbo.Lines", "OrderNumber", c => c.Int(nullable: false, identity: true));
            AddPrimaryKey("dbo.Lines", "OrderNumber");
            AddForeignKey("dbo.StationLines", "Line_OrderNumber", "dbo.Lines", "OrderNumber", cascadeDelete: true);
            AddForeignKey("dbo.TimetableEntries", "LineId", "dbo.Lines", "OrderNumber", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.TimetableEntries", "LineId", "dbo.Lines");
            DropForeignKey("dbo.StationLines", "Line_OrderNumber", "dbo.Lines");
            DropPrimaryKey("dbo.Lines");
            AlterColumn("dbo.Lines", "OrderNumber", c => c.Int(nullable: false));
            AddPrimaryKey("dbo.Lines", "OrderNumber");
            AddForeignKey("dbo.TimetableEntries", "LineId", "dbo.Lines", "OrderNumber", cascadeDelete: true);
            AddForeignKey("dbo.StationLines", "Line_OrderNumber", "dbo.Lines", "OrderNumber", cascadeDelete: true);
        }
    }
}
