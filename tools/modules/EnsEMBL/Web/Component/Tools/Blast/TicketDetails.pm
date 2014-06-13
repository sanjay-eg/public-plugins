=head1 LICENSE

Copyright [1999-2014] Wellcome Trust Sanger Institute and the EMBL-European Bioinformatics Institute

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

=cut

package EnsEMBL::Web::Component::Tools::Blast::TicketDetails;

use strict;
use warnings;

use parent qw(
  EnsEMBL::Web::Component::Tools::TicketDetails
  EnsEMBL::Web::Component::Tools::Blast
);

sub content_ticket {
  my ($self, $ticket, $jobs) = @_;
  my $hub     = $self->hub;
  my $div     = $self->dom->create_element('div');
  my $is_view = ($hub->function || '') eq 'View';

  $div->set_attribute('class', $is_view ? 'plain-box' : '_ticket_details hidden toggleable');

  $div->append_child($self->job_details_table($_, $is_view ? [qw(status results edit delete)] : ())) for @$jobs;

  return $div->render;
}

sub allowed_url_functions {
  return qw(View Results);
}

1;