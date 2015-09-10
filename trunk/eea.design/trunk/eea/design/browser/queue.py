""" Async Jobs BrowserView
"""

from Products.Five import BrowserView

class JobsView(BrowserView):

    def js(self, timeout=30000):
        """Returns the javascript code for async call
        """
        return """
jQuery(function($) {
  var update = function() {
    var escape = function(s) {
        return s.replace('<', '&lt;').replace('>', '&gt;');
    }

    $.fn.render = function(data) {
      var rows = ['<caption style="width:100%%;">'];
      rows.push('<div class="portalMessage informationMessage">');
      rows.push('The list is refreshed every %(seconds)s seconds.');
      rows.push('</div></caption>');
      rows.push('<tr><th>Job</th><th>Status</th></tr>');
      $(data).each(function(i, job) {
        row = ['<tr><td><div><strong>' + escape(job.callable) +
            '</strong></div>'];
        row.push('<div>' + escape(job.args) + '</div></td>');
        row.push('<td>' + job.status);
        if (job.progress)
          row.push('<div>' + job.progress + '</div>');
        if (job.failure)
          row.push('<div>' + job.failure + '</div>')
        rows.push(row.join('') + '</tr>');
      });
      $('table', this).html(rows.join(''));
      var form = this.closest('form');
      var legend = $('legend', this);
      $('.formTab span', form).eq($('legend', form).
        index(legend)).html(legend.html().replace('0', data.length));
    };

    $.getJSON('jobs.json', function(data) {
      $('#queued-jobs').render(data.queued);
      $('#active-jobs').render(data.active);
      $('#dead-jobs').render(data.dead);
      $('#completed-jobs').render(data.completed);
    });

    setTimeout(update, %(timeout)s);
  };
  update();
});
""" % {'seconds': timeout/1000, 'timeout': timeout}
