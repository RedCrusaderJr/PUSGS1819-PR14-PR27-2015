namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ticketCheckedAt : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Tickets", "CheckedAt", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Tickets", "CheckedAt");
        }
    }
}
