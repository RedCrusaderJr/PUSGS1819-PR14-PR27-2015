namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class meargemigrationafterwebsockets : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Autobus", "AddedAt", c => c.DateTime(nullable: false));
            AddColumn("dbo.Lines", "Version", c => c.Int(nullable: false));
            AddColumn("dbo.Stations", "Version", c => c.Int(nullable: false));
            AddColumn("dbo.CataloguePrices", "Version", c => c.Int(nullable: false));
            AddColumn("dbo.Catalogues", "Version", c => c.Int(nullable: false));
            AddColumn("dbo.TimetableEntries", "Version", c => c.Int(nullable: false));
            AddColumn("dbo.Timetables", "Version", c => c.Int(nullable: false));
            DropColumn("dbo.Lines", "RowVersion");
            DropColumn("dbo.Stations", "RowVersion");
            DropColumn("dbo.CataloguePrices", "RowVersion");
            DropColumn("dbo.Catalogues", "RowVersion");
            DropColumn("dbo.TimetableEntries", "RowVersion");
            DropColumn("dbo.Timetables", "RowVersion");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Timetables", "RowVersion", c => c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"));
            AddColumn("dbo.TimetableEntries", "RowVersion", c => c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"));
            AddColumn("dbo.Catalogues", "RowVersion", c => c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"));
            AddColumn("dbo.CataloguePrices", "RowVersion", c => c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"));
            AddColumn("dbo.Stations", "RowVersion", c => c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"));
            AddColumn("dbo.Lines", "RowVersion", c => c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"));
            DropColumn("dbo.Timetables", "Version");
            DropColumn("dbo.TimetableEntries", "Version");
            DropColumn("dbo.Catalogues", "Version");
            DropColumn("dbo.CataloguePrices", "Version");
            DropColumn("dbo.Stations", "Version");
            DropColumn("dbo.Lines", "Version");
            DropColumn("dbo.Autobus", "AddedAt");
        }
    }
}
