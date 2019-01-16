define([
  'react',
  'create-react-class',
  'pure-render-mixin',
  'prop-types'
],

function (React, createReactClass, PureRenderMixin, PropTypes) {
  'use strict';

  var el = React.createElement;

  return createReactClass({
    mixins: [PureRenderMixin],

    displayName: 'DirectTransactionInput',

    propTypes: {
      tabParticipants: PropTypes.arrayOf(PropTypes.string).isRequired,
      participants: PropTypes.arrayOf(PropTypes.object).isRequired
    },

    getInitialState: function () {
      return {};
    },

    getValues: function () {
      return {
        from: this.state.fromNewParticipant ? this.refs.fromNew.value : this.refs.from.value,
        to: this.state.toNewParticipant ? this.refs.toNew.value : this.refs.to.value,
        amount: parseFloat(this.refs.amount.value || 0)
      };
    },

    participants2Inputs: function (participants) {
      var result = {};

      for (var i = 0; i < participants.length; ++i) {
        var participant = participants[i];

        if (!result.amount) {
          result.amount = Math.abs(participant.amount);
        }

        if (!result.from && participant.amount > 0) {
          result.from = participant.participant;
        }

        if (!result.to && participant.amount < 0) {
          result.to = participant.participant;
        }
      }

      return result;
    },

    handleChangeFrom: function (event) {
      var input = this.refs.fromNew;
      this.setState({
        fromNewParticipant: event.currentTarget.value === 'New participant…'
      }, function () {
        input.focus();
      });
    },

    handleChangeTo: function (event) {
      var input = this.refs.toNew;
      this.setState({
        toNewParticipant: event.currentTarget.value === 'New participant…'
      }, function () {
        input.focus();
      });
    },

    render: function () {
      var inputProps = this.participants2Inputs(this.props.participants);
      var options = this.props.tabParticipants.concat('New participant…');

      return (
        el('div', {className: 'direct-transaction'},
          el('div', {className: 'form-row'},
            el('div', {className: 'form-row-input'},
              el('select',
                {
                  ref: 'from',
                  className: 'full-width',
                  defaultValue: inputProps.from,
                  onChange: this.handleChangeFrom
                },
                options.map(function (participant) {
                  return el('option', {key: participant}, participant);
                })
              )
            )
          ),
          el('div', {className: 'form-row', style: this.state.fromNewParticipant ? null : {display: 'none'}},
            el('div', {className: 'form-row-input'},
              el('input', {
                ref: 'fromNew',
                type: 'text',
                placeholder: 'Name …'
              })
            )
          ),
          el('div', {className: 'direct-transaction-amount'},
            el('svg', {height: 16, width: 16},
              el('path', {d: 'm15.511 8.5129c0-0.8974-1.0909-1.3404-1.7168-0.6973l-4.7832 4.7837v-11.573c0.019125-1.3523-2.0191-1.3523-2 0v11.572l-4.7832-4.7832c-0.94251-0.98163-2.3957 0.47155-1.4141 1.4141l6.49 6.4911c0.3878 0.387 1.0228 0.391 1.414 0l6.4903-6.4906c0.1935-0.1883 0.30268-0.4468 0.3027-0.7168z'})
            ),
            el('input', {
              ref: 'amount',
              type: 'number',
              step: 'any',
              placeholder: 0,
              defaultValue: inputProps.amount
            })
          ),
          el('div', {className: 'form-row'},
            el('div', {className: 'form-row-input'},
              el('select',
                {
                  ref: 'to',
                  className: 'full-width',
                  defaultValue: inputProps.to || this.props.tabParticipants[1],
                  onChange: this.handleChangeTo
                },
                options.map(function (participant) {
                  return el('option', {key: participant}, participant);
                })
              )
            )
          ),
          el('div', {className: 'form-row', style: this.state.toNewParticipant ? null : {display: 'none'}},
            el('div', {className: 'form-row-input'},
              el('input', {
                ref: 'toNew',
                type: 'text',
                placeholder: 'Name …'
              })
            )
          )
        )
      );
    }

  });

});
