namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddDiscountInPassanger : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.AspNetUsers", "Type", c => c.String(maxLength: 128));
            CreateIndex("dbo.AspNetUsers", "Type");
            AddForeignKey("dbo.AspNetUsers", "Type", "dbo.Discounts", "DiscountTypeName");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUsers", "Type", "dbo.Discounts");
            DropIndex("dbo.AspNetUsers", new[] { "Type" });
            AlterColumn("dbo.AspNetUsers", "Type", c => c.Int());
        }
    }
}
