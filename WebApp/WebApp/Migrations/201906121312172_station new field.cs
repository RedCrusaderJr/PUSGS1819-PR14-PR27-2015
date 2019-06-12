namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class stationnewfield : DbMigration
    {
        public override void Up()
        {
            RenameColumn(table: "dbo.Stations", name: "Line_OrderNumber", newName: "LineOrderNumber");
            RenameIndex(table: "dbo.Stations", name: "IX_Line_OrderNumber", newName: "IX_LineOrderNumber");
            AddColumn("dbo.Stations", "Address", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Stations", "Address");
            RenameIndex(table: "dbo.Stations", name: "IX_LineOrderNumber", newName: "IX_Line_OrderNumber");
            RenameColumn(table: "dbo.Stations", name: "LineOrderNumber", newName: "Line_OrderNumber");
        }
    }
}
