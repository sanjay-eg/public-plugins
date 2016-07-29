=head1 LICENSE

Copyright [1999-2015] Wellcome Trust Sanger Institute and the EMBL-European Bioinformatics Institute
Copyright [2016] EMBL-European Bioinformatics Institute

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

package EnsEMBL::Users::Command::Account::Favourites::Save;

use strict;
use warnings;

use JSON;

use EnsEMBL::Web::Document::HTML::FavouriteSpecies;
use EnsEMBL::Web::Document::HTML::SpeciesList;

use parent qw(EnsEMBL::Users::Command::Account);

sub process {
  my $self    = shift;
  my $hub     = $self->hub;
  my $r_user  = $hub->user->rose_object;

  my ($species_list)  = @{$r_user->specieslists};
      $species_list ||= $r_user->create_record('specieslist');

  $species_list->favourites($hub->param('favourites'));
  $species_list->save('user' => $r_user);

  print to_json({
    list      => EnsEMBL::Web::Document::HTML::FavouriteSpecies->new($hub)->render('fragment'),
    dropdown  => EnsEMBL::Web::Document::HTML::SpeciesList->new($hub)->render('fragment'),
  });

}

1;
