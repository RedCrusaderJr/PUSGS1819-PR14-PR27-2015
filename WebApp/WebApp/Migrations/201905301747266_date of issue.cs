namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class dateofissue : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Tickets", "DateOfIssue", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Tickets", "DateOfIssue");
        }
    }
}
