namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ticketCatPriceIsRequired : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Tickets", "PriceId", "dbo.CataloguePrices");
            DropIndex("dbo.Tickets", new[] { "PriceId" });
            AlterColumn("dbo.Tickets", "PriceId", c => c.String(nullable: false, maxLength: 128));
            CreateIndex("dbo.Tickets", "PriceId");
            AddForeignKey("dbo.Tickets", "PriceId", "dbo.CataloguePrices", "CataloguePriceId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Tickets", "PriceId", "dbo.CataloguePrices");
            DropIndex("dbo.Tickets", new[] { "PriceId" });
            AlterColumn("dbo.Tickets", "PriceId", c => c.String(maxLength: 128));
            CreateIndex("dbo.Tickets", "PriceId");
            AddForeignKey("dbo.Tickets", "PriceId", "dbo.CataloguePrices", "CataloguePriceId");
        }
    }
}
