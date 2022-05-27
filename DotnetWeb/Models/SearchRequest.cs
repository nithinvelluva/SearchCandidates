using System.Collections.Generic;

namespace DotnetWeb.Models
{
    public class SearchRequest
    {        
        public int Experience { get; set; }       
        public List<string> Skills { get; set; }
    }
}
