using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using Unity;
using WebApp.Persistence.Repository;
using WebApp.Persistence.Repository.ModelRepositories;

namespace WebApp.Persistence.UnitOfWork
{
    public class DemoUnitOfWork : IUnitOfWork
    {
        
        private readonly DbContext _context;
      
        public DemoUnitOfWork(DbContext context)
        {
            _context = context;
        }

        [Dependency]
        public IAutobusRepository AutobusRepository { get; set; }

        [Dependency]
        public ICataloguePriceRepository CataloguePriceRepository { get; set; }

        [Dependency]
        public ICatalogueRepository CatalogueRepository { get; set; }

        [Dependency]
        public IDiscountRepository DiscountRepository { get; set; }

        [Dependency]
        public ILineRepository LineRepository { get; set; }

        [Dependency]
        public IPassengerRepository PassengerRepository { get; set; }

        [Dependency]
        public IStationRepository StationRepository { get; set; }

        [Dependency]
        public ITicketRepository TicketRepository { get; set; }

        [Dependency]
        public ITimetableEntryRepository TimetableEntryRepository { get; set; }

        [Dependency]
        public ITimetableRepository TimetableRepository { get; set; }

        public int Complete()
        {
            return _context.SaveChanges();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}