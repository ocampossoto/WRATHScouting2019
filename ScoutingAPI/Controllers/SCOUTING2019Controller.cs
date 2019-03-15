using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using ScoutingAPI.Models;

namespace ScoutingAPI.Controllers
{
    public class SCOUTING2019Controller : ApiController
    {
        private scoutingEntities db = new scoutingEntities();

        // GET: api/SCOUTING2019
        public IQueryable<SCOUTING2019> GetSCOUTING2019()
        {
            return db.SCOUTING2019;
        }

        // GET: api/SCOUTING2019/5
        [ResponseType(typeof(SCOUTING2019))]
        public async Task<IHttpActionResult> GetSCOUTING2019(int id)
        {
            SCOUTING2019 sCOUTING2019 = await db.SCOUTING2019.FindAsync(id);
            if (sCOUTING2019 == null)
            {
                return NotFound();
            }

            return Ok(sCOUTING2019);
        }

        // PUT: api/SCOUTING2019/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutSCOUTING2019(int id, SCOUTING2019 sCOUTING2019)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != sCOUTING2019.Id)
            {
                return BadRequest();
            }

            db.Entry(sCOUTING2019).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SCOUTING2019Exists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/SCOUTING2019
        [ResponseType(typeof(SCOUTING2019))]
        public async Task<IHttpActionResult> PostSCOUTING2019(SCOUTING2019 sCOUTING2019)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            db.SCOUTING2019.Add(sCOUTING2019);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = sCOUTING2019.Id }, sCOUTING2019);
        }

        // DELETE: api/SCOUTING2019/5
        [ResponseType(typeof(SCOUTING2019))]
        public async Task<IHttpActionResult> DeleteSCOUTING2019(int id)
        {
            SCOUTING2019 sCOUTING2019 = await db.SCOUTING2019.FindAsync(id);
            if (sCOUTING2019 == null)
            {
                return NotFound();
            }

            db.SCOUTING2019.Remove(sCOUTING2019);
            await db.SaveChangesAsync();

            return Ok(sCOUTING2019);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SCOUTING2019Exists(int id)
        {
            return db.SCOUTING2019.Count(e => e.Id == id) > 0;
        }
    }
}