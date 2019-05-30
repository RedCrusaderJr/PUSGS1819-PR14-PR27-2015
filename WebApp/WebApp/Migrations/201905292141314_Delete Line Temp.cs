namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class DeleteLineTemp : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Lines", "Temp");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Lines", "Temp", c => c.String());
        }
    }
}
