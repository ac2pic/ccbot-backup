# The Role Management System

The role management system is just as messy as it was in the previous bot, but now it provides a cleaner user interface.

## Concepts

The system has two primary concepts: Role groups and role group groups.

Both are arrays of strings, those strings being the names of the relevant objects.

There are 2 hard-coded role groups, and 2 hard-coded role group groups.


The hard-coded role groups are `group-admin` and `group-self-serve`.

`group-admin` roles provide access to local bot administrative capabilities.

By default, bot owners are the only people capable of administrative control,
 and remain the only people capable of more global administrative capabilities in all cases.

`group-self-serve` roles can be added and removed by anyone to themselves.


The hard-coded role group groups add additional rules to `self-serve`.

`exclusive` only allows up to one role in each group to be active at any given time.

Attempting to add another role will cancel out.

`inclusive` forces at least one role in each group to be active at any given time.

Note that `-roles add` only considers `exclusive` rules, and `-roles rm` only considers `inclusive` rules.

The rules are not considered outside of these interactions.

Thus, complex interactions between role groups may lead to an inconsistent state.

## Configuring

The `-roles configure <setting> <...>` command, from within a guild, configures a role group or role group group.

It can only be run if the user has local bot administrator status, which can only be granted by a bot owner.