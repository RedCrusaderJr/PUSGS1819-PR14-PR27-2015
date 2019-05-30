namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class lineIsUrban : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Lines", "IsUrban", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Lines", "IsUrban");
        }
    }
}
