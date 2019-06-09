namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class LineandStationmodification : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.StationLines", "Station_StationId", "dbo.Stations");
            DropForeignKey("dbo.StationLines", "Line_OrderNumber", "dbo.Lines");
            DropForeignKey("dbo.Stations", "LocationId", "dbo.Locations");
            DropIndex("dbo.Stations", new[] { "LocationId" });
            DropIndex("dbo.StationLines", new[] { "Station_StationId" });
            DropIndex("dbo.StationLines", new[] { "Line_OrderNumber" });
            AddColumn("dbo.Lines", "Path", c => c.String());
            AddColumn("dbo.Stations", "Longitude", c => c.Double(nullable: false));
            AddColumn("dbo.Stations", "Latitude", c => c.Double(nullable: false));
            AddColumn("dbo.Stations", "Line_OrderNumber", c => c.String(maxLength: 128));
            CreateIndex("dbo.Stations", "Line_OrderNumber");
            AddForeignKey("dbo.Stations", "Line_OrderNumber", "dbo.Lines", "OrderNumber");
            DropColumn("dbo.Stations", "LocationId");
            DropTable("dbo.Locations");
            DropTable("dbo.StationLines");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.StationLines",
                c => new
                    {
                        Station_StationId = c.Int(nullable: false),
                        Line_OrderNumber = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.Station_StationId, t.Line_OrderNumber });
            
            CreateTable(
                "dbo.Locations",
                c => new
                    {
                        LocationId = c.String(nullable: false, maxLength: 128),
                        XCoordinate = c.String(),
                        YCoordinate = c.String(),
                        StreetName = c.String(),
                        StreetNumber = c.String(),
                        City = c.String(),
                        ZipCode = c.String(),
                    })
                .PrimaryKey(t => t.LocationId);
            
            AddColumn("dbo.Stations", "LocationId", c => c.String(maxLength: 128));
            DropForeignKey("dbo.Stations", "Line_OrderNumber", "dbo.Lines");
            DropIndex("dbo.Stations", new[] { "Line_OrderNumber" });
            DropColumn("dbo.Stations", "Line_OrderNumber");
            DropColumn("dbo.Stations", "Latitude");
            DropColumn("dbo.Stations", "Longitude");
            DropColumn("dbo.Lines", "Path");
            CreateIndex("dbo.StationLines", "Line_OrderNumber");
            CreateIndex("dbo.StationLines", "Station_StationId");
            CreateIndex("dbo.Stations", "LocationId");
            AddForeignKey("dbo.Stations", "LocationId", "dbo.Locations", "LocationId");
            AddForeignKey("dbo.StationLines", "Line_OrderNumber", "dbo.Lines", "OrderNumber", cascadeDelete: true);
            AddForeignKey("dbo.StationLines", "Station_StationId", "dbo.Stations", "StationId", cascadeDelete: true);
        }
    }
}
