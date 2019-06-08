namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ProcessingType : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "ProcessingPhase", c => c.Int());
            AddColumn("dbo.Tickets", "PaidPrice", c => c.Double(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Tickets", "PaidPrice");
            DropColumn("dbo.AspNetUsers", "ProcessingPhase");
        }
    }
}
