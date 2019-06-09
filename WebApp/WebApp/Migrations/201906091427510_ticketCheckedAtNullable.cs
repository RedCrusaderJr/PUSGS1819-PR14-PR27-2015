namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ticketCheckedAtNullable : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Tickets", "CheckedAt", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Tickets", "CheckedAt", c => c.DateTime(nullable: false));
        }
    }
}
