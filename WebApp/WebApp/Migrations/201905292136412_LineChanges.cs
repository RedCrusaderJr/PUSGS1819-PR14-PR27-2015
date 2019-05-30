namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class LineChanges : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.TimetableEntries", "LineId", "dbo.Lines");
            DropForeignKey("dbo.StationLines", "Line_OrderNumber", "dbo.Lines");
            DropIndex("dbo.TimetableEntries", new[] { "LineId" });
            DropIndex("dbo.StationLines", new[] { "Line_OrderNumber" });
            AddColumn("dbo.Lines", "Temp", c => c.String());
            DropPrimaryKey("dbo.Lines");
            DropColumn("dbo.Lines", "OrderNumber");
            DropPrimaryKey("dbo.StationLines");   
            AddColumn("dbo.Lines", "OrderNumber", c => c.String(nullable: false, maxLength: 128));
            AlterColumn("dbo.TimetableEntries", "LineId", c => c.String(maxLength: 128));
            AlterColumn("dbo.StationLines", "Line_OrderNumber", c => c.String(nullable: false, maxLength: 128));
            AddPrimaryKey("dbo.Lines", "OrderNumber");
            AddPrimaryKey("dbo.StationLines", new[] { "Station_StationId", "Line_OrderNumber" });
            CreateIndex("dbo.TimetableEntries", "LineId");
            CreateIndex("dbo.StationLines", "Line_OrderNumber");
            AddForeignKey("dbo.TimetableEntries", "LineId", "dbo.Lines", "OrderNumber");
            AddForeignKey("dbo.StationLines", "Line_OrderNumber", "dbo.Lines", "OrderNumber", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.StationLines", "Line_OrderNumber", "dbo.Lines");
            DropForeignKey("dbo.TimetableEntries", "LineId", "dbo.Lines");
            DropIndex("dbo.StationLines", new[] { "Line_OrderNumber" });
            DropIndex("dbo.TimetableEntries", new[] { "LineId" });
            DropPrimaryKey("dbo.StationLines");
            DropPrimaryKey("dbo.Lines");
            AlterColumn("dbo.StationLines", "Line_OrderNumber", c => c.Int(nullable: false));
            AlterColumn("dbo.TimetableEntries", "LineId", c => c.Int(nullable: false));
            AlterColumn("dbo.Lines", "OrderNumber", c => c.Int(nullable: false, identity: true));
            DropColumn("dbo.Lines", "Temp");
            AddPrimaryKey("dbo.StationLines", new[] { "Station_StationId", "Line_OrderNumber" });
            AddPrimaryKey("dbo.Lines", "OrderNumber");
            CreateIndex("dbo.StationLines", "Line_OrderNumber");
            CreateIndex("dbo.TimetableEntries", "LineId");
            AddForeignKey("dbo.StationLines", "Line_OrderNumber", "dbo.Lines", "OrderNumber", cascadeDelete: true);
            AddForeignKey("dbo.TimetableEntries", "LineId", "dbo.Lines", "OrderNumber", cascadeDelete: true);
        }
    }
}
